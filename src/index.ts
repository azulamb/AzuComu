/// <reference path="./components/profile-area.ts" />
/// <reference path="./components/triming-area.ts" />

Promise.all(
[
	customElements.whenDefined( 'triming-area' ),
	customElements.whenDefined( 'profile-area' ),
] ).then( () =>
{
	const profile = <ProfileAreaElement>document.getElementById( 'profileimg' );
	const edit = <TrimingAreaElement>document.getElementById( 'editimg' );

	let triming: TrimingButtonElement;
	profile.addEventListener( 'edit', ( event ) =>
	{
		triming = event.detail.triming;
		edit.x = triming.sx;
		edit.y = triming.sy;
		edit.w = triming.sw;
		edit.h = triming.sh;
		edit.width = event.detail.triming.dw;
		edit.height = event.detail.triming.dh;
		setTimeout( () =>
		{
			edit.setImage( event.detail.image );
			edit.show = true;
		} );
	});

	edit.addEventListener( 'change', () =>
	{
		triming.sx = edit.x;
		triming.sy = edit.y;
		triming.sw = edit.w;
		triming.sh = edit.h;
		profile.updateImage();
		edit.show = false;
	} );

	document.querySelectorAll( 'header button' ).forEach( ( button ) =>
	{
		const target = button.id.replace( 'go_', '' );
		button.addEventListener( 'click', () =>
		{
			document.body.dataset.page = target;
		} );
	} );

	document.addEventListener( 'touchstart', ( event ) =>
	{
		if ( event.touches.length > 1 ) {
		  event.preventDefault();
		}
	}, { passive: false } );
	document.addEventListener( 'touchmove', ( event ) =>
	{
		event.preventDefault();
	}, { passive: false } );
} );
