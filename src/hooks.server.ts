export const handle = async ({ event, resolve }) => {
    // console.log(event.request.headers.get('user-agent'));
    // console.log(event.request.headers.get('sec-ch-ua'));
    // console.log(event.request.headers.get('sec-ch-ua-mobile'));
    // console.log(event.request.headers.get('sec-ch-ua-platform'));
    return await resolve(event);
}