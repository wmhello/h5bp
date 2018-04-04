/**
 * Created by fendoe on 2015/3/28.
 */
;
(function ($) {


    function pageload() {
        $('#fmquickquote input:text').val('');

        $('#fmquickquote').on('change', 'input:text', function (e) {
            $('#volumeweight').text(comm.toDecimal(volumeweight(), 1) + 'kg');
        });

        if(!localStorage.getItem('EMSDialog')){
            services.api.topic.post({name:'goodnews'},function(data){
                if(data.body){
                    $('body').Dialog({
                        title: '',
                        body: data.body,
                        modal: 'EMSDialog',
                        isbackdrop: true
                    });
                    window.localStorage.setItem('EMSDialog',1);
                }
            });
        }
    }

    function bindEvent() {

        $('#carousel-example-generic').on('slide.bs.carousel', function (e) {
            $(e.target).parents('.wb-section').animate({
                backgroundColor: $(e.relatedTarget).data('bg')
            }, 500)
        })

        $('#parcels').click(function (e) {
            var now = Date.now();
            sessionStorage.setItem(now, JSON.stringify(GetPackage()));
            window.location.href = '/parcel/send-multiple-parcels?key=' + now;
        });

        $('#quickquote').click(function (e) {
            if (validateElement()) {
                $('#fmquickquote').submit();
            }
        });

        $('#searchno').click(function (e) {
            var number = $.trim($('#ordernumber').val());
            if (number) {
                comm.linkOpenTab('http://www.track-parcel.com/ParcelTracking.aspx?ParcelNo=' + number);
            }
        })


        $('[data-toggle="tooltip"]').tooltip();
    }

    function GetPackage() {
        return {
            DeliveryCountryCode: $('#DeliveryCountryCode').val() || 0,
            ActualWeight: comm.toDecimal($('#ActualWeight').val()) || 0,
            DimLength: comm.toDecimal($('#DimLength').val()) || 0,
            DimWidth: comm.toDecimal($('#DimWidth').val()) || 0,
            DimHeight: comm.toDecimal($('#DimHeight').val()) || 0,
            PackageType:0
        }
    }

    function volumeweight() {
        var data = GetPackage();
        var value = data.DimLength * data.DimWidth * data.DimHeight / 5000
        return value > 0.1 ? value : 0.1;
    }

    function validateElement() {
        var data = GetPackage();
        var weight = data.DimLength * data.DimWidth * data.DimHeight / 5000;
        var isValidate = false;
        if (data.ActualWeight == 0 || weight == 0) {
            $('#alert').modal('show');
        } else if (data.ActualWeight > 30 || weight > 30) {
            $('#alert').modal('show');
        } else {
            isValidate = true;
        }
        return isValidate;
    }

    function init() {
        bindEvent();
        pageload();
    }

    $(function () {
        init();
    })
})(jQuery);