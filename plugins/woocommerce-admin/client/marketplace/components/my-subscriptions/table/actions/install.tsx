/**
 * External dependencies
 */
import { Button, Icon } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useContext, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SubscriptionsContext } from '../../../../contexts/subscriptions-context';
import { installProduct } from '../../../../utils/functions';
import { Subscription } from '../../types';

interface InstallProps {
	subscription: Subscription;
}

export default function Install( props: InstallProps ) {
	const [ loading, setLoading ] = useState( false );
	const { createWarningNotice, createSuccessNotice } =
		useDispatch( 'core/notices' );
	const { loadSubscriptions } = useContext( SubscriptionsContext );

	const install = () => {
		setLoading( true );
		installProduct( props.subscription.product_key )
			.then( () => {
				loadSubscriptions( false ).then( () => {
					createSuccessNotice(
						sprintf(
							// translators: %s is the product name.
							__( '%s successfully installed.', 'woocommerce' ),
							props.subscription.product_name
						),
						{
							icon: <Icon icon="yes" />,
						}
					);
					setLoading( false );
				} );
			} )
			.catch( () => {
				createWarningNotice(
					sprintf(
						// translators: %s is the product name.
						__( '%s couldn’t be installed.', 'woocommerce' ),
						props.subscription.product_name
					),
					{
						actions: [
							{
								label: __( 'Try again', 'woocommerce' ),
								onClick: install,
							},
						],
					}
				);
				setLoading( false );
			} );
	};

	function installButtonLabel( installing: boolean ) {
		if ( installing ) {
			return __( 'Installing…', 'woocommerce' );
		}

		return __( 'Install', 'woocommerce' );
	}

	if ( props.subscription.local.installed === true ) {
		return null;
	}

	return (
		<Button
			variant="primary"
			isBusy={ loading }
			disabled={ loading }
			onClick={ install }
		>
			{ installButtonLabel( loading ) }
		</Button>
	);
}