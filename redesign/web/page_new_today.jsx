// New screens added today — wraps each static HTML in an iframe so it can be browsed inside the Web App shell.
// Files live in /screens/*.html and are token-aligned with colors_and_type.css.

function ScreenFrame({ src, bg = '#EDEAE3' }) {
  return (
    <div style={{ flex:1, background:bg, display:'flex', alignItems:'center', justifyContent:'center', overflow:'auto', position:'relative' }}>
      <iframe
        src={src}
        title={src}
        style={{ width:'100%', height:'100%', border:0, background:'transparent' }}
      />
    </div>
  );
}

function MobileScreenFrame({ src }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'#fff' }}>
      <iframe src={src} title={src} style={{ width:'100%', height:'100%', border:0 }} />
    </div>
  );
}

// Desktop wrappers
function NewGuaranteePage()   { return <ScreenFrame src="screens/score-guarantee.html" />; }
function NewTrialWarnsPage()  { return <ScreenFrame src="screens/trial-warnings.html" bg="#F4F1EB" />; }
function NewPaymentSuccess()  { return <ScreenFrame src="screens/payment-success.html" />; }
function NewCancelPage()      { return <ScreenFrame src="screens/cancellation.html" bg="#F4F1EB" />; }
function NewError404()        { return <ScreenFrame src="screens/error-404.html" />; }
function NewError500()        { return <ScreenFrame src="screens/error-500.html" />; }
function NewOfflinePage()     { return <ScreenFrame src="screens/offline.html" bg="#F4F1EB" />; }

// Mobile wrappers — same screens, fitted to the mobile frame
function MNewGuaranteePage()  { return <MobileScreenFrame src="screens/score-guarantee.html" />; }
function MNewTrialWarnsPage() { return <MobileScreenFrame src="screens/trial-warnings.html" />; }
function MNewPaymentSuccess() { return <MobileScreenFrame src="screens/payment-success.html" />; }
function MNewCancelPage()     { return <MobileScreenFrame src="screens/cancellation.html" />; }
function MNewError404()       { return <MobileScreenFrame src="screens/error-404.html" />; }
function MNewError500()       { return <MobileScreenFrame src="screens/error-500.html" />; }
function MNewOfflinePage()    { return <MobileScreenFrame src="screens/offline.html" />; }

Object.assign(window, {
  NewGuaranteePage, NewTrialWarnsPage, NewPaymentSuccess, NewCancelPage,
  NewError404, NewError500, NewOfflinePage,
  MNewGuaranteePage, MNewTrialWarnsPage, MNewPaymentSuccess, MNewCancelPage,
  MNewError404, MNewError500, MNewOfflinePage,
});
