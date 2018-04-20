import Vue from 'vue'
import Moment from 'moment'

Vue.filter('datetime', function (date) {
    return Moment(date).format('MMMM Do YYYY - hh:mm') + 'u'
})
Vue.filter('date', function (date) {
    return Moment(date).format('MMMM Do YYYY')
})
Vue.filter('distance', function (distance) {
    return (Math.round((distance/1000) * 10 ) / 10).toFixed(1) + " km"
})
Vue.filter('duration', function (duration) {
    let sec_num = parseInt(duration, 10); // don't forget the second param
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    // let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours > 0) {
        return hours + ' hr ' + minutes + ' min'
    } else {
        return minutes + ' min'
    }
})
Vue.filter('capitalize', function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
})
Vue.filter('riders', function (count) {
    // returns 1 rider / * riders
    return count === 1 ? count + ' Rider already Joined!' : count + ' Riders already Joined!'
})