import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Mux from '@mux/mux-node';

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const sig = req.headers.get('mux-signature');

    const webhookSecret = process.env.MUX_WEBHOOK_SECRET;
    
    let event;
    if (webhookSecret && sig) {
      // In @mux/mux-node v8, webhooks.unwrap replaces verifySignature and parses JSON safely.
      const mux = new Mux({
        tokenId: process.env.MUX_TOKEN_ID || 'dummy',
        tokenSecret: process.env.MUX_TOKEN_SECRET || 'dummy',
      });
      // Conversão forçada de Headers do Next.js Request
      const headersObject: Record<string, string> = {};
      req.headers.forEach((value, key) => { headersObject[key] = value });
      
      event = mux.webhooks.unwrap(payload, headersObject, webhookSecret);
    } else {
      // Durante o dev, se não houver validadores, converte JSON normal. (Não recomendado em Prod)
      event = JSON.parse(payload);
    }

    // Root Access (Service Role) necessário pois o Mux Webhook não manda cookies do usuário.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    switch (event.type) {
      case 'video.asset.ready': {
        const asset = event.data;
        const uploadId = asset.upload_id;
        const assetId = asset.id;
        const playbackId = asset.playback_ids && asset.playback_ids[0] ? asset.playback_ids[0].id : null;

        if (uploadId) {
          console.log(`[MUX WEBHOOK] Asset ${assetId} finalizado (Upload ID: ${uploadId}). Salvando chaves...`);
          
          await supabaseAdmin
            .from('lessons')
            .update({
              mux_asset_id: assetId,
              mux_playback_id: playbackId,
            })
            .eq('mux_upload_id', uploadId);
        }
        break;
      }
      
      case 'video.asset.deleted': {
         const assetId = event.data.id;
         console.log(`[MUX WEBHOOK] Asset deletado pela dashboard da Mux, refletindo BD: ${assetId}`);
         await supabaseAdmin
            .from('lessons')
            .update({
              mux_asset_id: null,
              mux_playback_id: null,
            })
            .eq('mux_asset_id', assetId);
         break;
      }

      default:
         console.log(`[MUX WEBHOOK] Evento descartado/ignorado: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Erro na Rota Mux Webhooks:', error.message);
    return NextResponse.json(
      { error: `Webhook Handler Failed: ${error.message}` },
      { status: 400 }
    );
  }
}
