/// <reference path="./components/profile-area.ts" />
/// <reference path="./components/trimming-area.ts" />

Promise.all(
[
	customElements.whenDefined( 'trimming-area' ),
	customElements.whenDefined( 'profile-area' ),
] ).then( () =>
{
	const profile = <ProfileAreaElement>document.getElementById( 'profileimg' );
	const edit = <TrimmingAreaElement>document.getElementById( 'editimg' );

	let trimming: TrimmingButtonElement;
	profile.addEventListener( 'edit', ( event ) =>
	{
		trimming = event.detail.trimming;
		edit.x = trimming.sx;
		edit.y = trimming.sy;
		edit.w = trimming.sw;
		edit.h = trimming.sh;
		edit.width = event.detail.trimming.dw;
		edit.height = event.detail.trimming.dh;
		setTimeout( () =>
		{
			edit.setImage( event.detail.image );
			edit.show = true;
		} );
	});

	edit.addEventListener( 'change', () =>
	{
		trimming.sx = edit.x;
		trimming.sy = edit.y;
		trimming.sw = edit.w;
		trimming.sh = edit.h;
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
