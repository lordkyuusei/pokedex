export async function handle({ event, resolve, ...rest }) {
    event.locals.mobile = event.request.headers.get('sec-ch-ua-mobile') === '?1';

    const response = await resolve(event);
    return response;
}