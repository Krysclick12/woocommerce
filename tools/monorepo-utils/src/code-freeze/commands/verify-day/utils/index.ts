/**
 * External dependencies
 */
import { DateTime } from 'luxon';

import { getToday, DAYS_BETWEEN_CODE_FREEZE_AND_RELEASE } from '../../get-version/lib'

export { getToday, DAYS_BETWEEN_CODE_FREEZE_AND_RELEASE };

/**
 * Get a future date from today to see if its the release day.
 *
 * @param {DateTime} today The time to use in checking if today is the day of the code freeze.
 * @return {DateTime} The Date object of the future date.
 */
export const getFutureDate = ( today: DateTime ) => {
	return today.plus( { days: DAYS_BETWEEN_CODE_FREEZE_AND_RELEASE } );
};

/**
 * Determines if today is the day of the code freeze.
 *
 * @param {string} now The time to use in checking if today is the day of the code freeze. Default to now.
 * @return {boolean} true if today is the day of the code freeze.
 */
export const isTodayCodeFreezeDay = ( now: string ) => {
	const today = getToday( now );
	const futureDate = getFutureDate( today );
	const month = futureDate.get( 'month' );
	const year = futureDate.get( 'year' );
	const firstDayOfMonth = DateTime.utc( year, month, 1 );
	const dayOfWeek = firstDayOfMonth.get( 'weekday' );
	const secondTuesday = dayOfWeek <= 2 ? 10 - dayOfWeek : 17 - dayOfWeek;
	return futureDate.get( 'day' ) === secondTuesday;
};
