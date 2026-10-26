import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let category = '';
    let videoUrl = '';
    let message = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = body.name?.trim() || '';
      email = body.email?.trim() || '';
      category = body.category?.trim() || '';
      videoUrl = body.videoUrl?.trim() || '';
      message = body.message?.trim() || '';
    } else {
      const formData = await request.formData();
      name = (formData.get('name') as string)?.trim() || '';
      email = (formData.get('email') as string)?.trim() || '';
      category = (formData.get('category') as string)?.trim() || '';
      videoUrl = (formData.get('videoUrl') as string)?.trim() || '';
      message = (formData.get('message') as string)?.trim() || '';
    }

    // Basic Validation
    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: 'Por favor, informe seu nome completo.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Por favor, informe um endereço de e-mail válido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!message || message.length < 10) {
      return new Response(JSON.stringify({ error: 'Sua mensagem deve conter no mínimo 10 caracteres.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log internally for developer monitoring
    console.log('[Contact Form Submission]', {
      name,
      email,
      category: category || 'Geral',
      videoUrl: videoUrl || 'N/A',
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Obrigado pelo contato! Sua mensagem foi recebida com sucesso. Responderemos em até 24-48 horas.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    console.error('[Contact Form Error]', err);
    return new Response(
      JSON.stringify({ error: 'Ocorreu um erro interno ao processar sua mensagem. Tente novamente mais tarde.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
