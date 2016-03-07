export default ($interpolate) => {

    "ngInject";


    var $locale;

    return {

        setLocale: function(locale) {
            $locale = locale;  // locale = zh || en ; 
        },

        getInterpolationIdentifier: function() {
            return 'custom';
        },

        interpolate: function(string, interpolateParams) {
        	console.log('interpolate' , string , interpolateParams )
            return   $interpolate(string)(interpolateParams) +"xx"
        }
    };

}
