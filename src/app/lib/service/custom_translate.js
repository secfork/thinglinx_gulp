
// 英文 指示 , 以后 作废 删掉!
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
            return   $interpolate(string)(interpolateParams) + ( $locale =='en'?'_en':"" );
        }
    };

}
