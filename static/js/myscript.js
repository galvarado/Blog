document.write('<script type="text/javascript" src="//downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>')

window.dojoRequire(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us19.list-manage.com","uuid":"7ca0350f86d9576b40bfe7cee","lid":"0649daac95","uniqueMethods":true}) })

// Redirect in case of match the URL
currentUrl=window.location.href;
if(currentUrl=="https://galvarado.com.mx/static/location/")
	{
		window.location.replace("https://goo.gl/maps/BfSgCgStr6FsHeF4A")
}