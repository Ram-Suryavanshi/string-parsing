(function ($) {

   
    var object = [];

    $("body").append(
        '<div class="popup-overlay">'+
        '<div class="popup-content">'+
        '<h3 style="margin:10px">Location Suggestions</h3>' +
        '<ul class="data" style="list-style-type:none"> </ul>'+
        '<button class="badge badge-pill badge-danger remove" style="float:right"><b>X</b></button>' +
        '</div>' +
        '</div>'
    );

    $.ajax({
        url: 'Response.xml',
        dataType: 'xml',
        success: function(data){
            // Extract relevant data from XML
            console.log(data);
            var xml = $(data);
            var location = xml.find("cln1\\:SuggestionList").text(); 
            var parse1 = location.split("::;:")[1];
            outputString = parse1.replace(/([~!@#$%^&*()_+=`{}|\\:;'<>,.\/? ])+/g, ' ');

            var regDigit = new RegExp(/\b\d+-\d+\s+/);
            var regDigitOdd = new RegExp(/\b\d+-\d+\((Odd)/);
            var regDigitEven = new RegExp(/\b\d+-\d+\((Even)/);

            var regSquare = new RegExp(/\[([A-Z]-[A-Z])\]/i);            
            var regSquare1A1D = new RegExp(/\[(\d+[A-Z]-\d+[A-Z])\]/i);
            var regSquareA1A5 = new RegExp(/\[([A-Z]\d+-[A-Z]\d+)\]/i);

            var regSquareDigit = new RegExp(/\[([0-9]+-[0-9]+)\]\B/);
            var regSquareDigitEven = new RegExp(/\[([0-9]+-[0-9]+)\](Even)\b/i);
            var regSquareDigitOdd = new RegExp(/\[([0-9]+-[0-9]+)\](Odd)\b/i);


            // var testString = outputString;
            // var testString = '2424 N Federal Hwy Ste [104-114]Odd';
            // var testString = '2424 N Federal Hwy Ste [104-114]';
            var testString = '902-920(Even) S Rogers Cir';
            var testString1 = '902-920(Odd) S Rogers Cir';
            // var testString = ' 2115 Spring Harbor Dr Apt [145A-145D]';
            // var testString = ' 2115 Spring Harbor Dr Apt [a-b]';

            if(regDigit.test(testString)){
                console.log('Great, matched regDigit');
                var subArray = [];
                subArray.push(testString);
                object.push({'address':testString,'subAddress':subArray})
            }

            if(regDigitOdd.test(testString1)){
                console.log('Great, matched regDigitOdd',testString);
                var subArray = [];
                var no1 = testString1.replace(/[^0-9-\.]+/gi, '');
                subAd = testString1.split('(Odd)')[1];
                var no2 = no1.split('-')[0];
                var no3 = no1.split('-')[1];
                console.log(no1, no3, no2, 'substr',subAd);
                               
                for (let c = no2; c <= no3; c++) {
                    if(!(c%2) == 0){
                        var s = c + subAd;
                        subArray.push(s);
                    }
                }
                object.push({'address':testString1,'subAddress':subArray});
            }

            if(regDigitEven.test(testString)){
                console.log('Great, matched regDigitEven');
                var subArray = [];
                var no1 = testString.replace(/[^0-9-\.]+/gi, '');
                subAd = testString.split('(Even)')[1];
                var no2 = no1.split('-')[0];
                var no3 = no1.split('-')[1];
                console.log(no1, no3, no2, 'substr',subAd);
                               
                for (let c = no2; c <= no3; c++) {
                    if((c%2) == 0){
                        var s = c + subAd;
                        subArray.push(s);
                    }
                }
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquare.test(testString)){
                console.log('Great, matched regSquare');
                var subArray = [];
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];

                for (let c = chlidArr2.charCodeAt(0); c <= chlidArr2.charCodeAt(2); c++) {
                    // console.log(chlidArr1+' '+String.fromCharCode(c));
                    var s = chlidArr1+' '+String.fromCharCode(c)
                    subArray.push(s);
                }
                // console.log(outputString, 'child arr',chlidArr2);
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquare1A1D.test(testString)){
                console.log('Great, matched regSquare1A1D');
                var subArray = [];
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];
                var no = chlidArr2.split("-")[0].replace(/[^0-9\.]+/gi, '');
                var sourceAlpha = chlidArr2.split("-")[0].replace(/[^A-Z\.]+/gi, '');
                var targetAlpha = chlidArr2.split("-")[1].replace(/[^A-Z\.]+/gi, '');
                console.log('remove alphabet',no, 'frist alpha:' ,sourceAlpha, 'target',targetAlpha );
                console.log(chlidArr2);
                for (let c = sourceAlpha.charCodeAt(0); c <= targetAlpha.charCodeAt(0); c++) {
                    var s = chlidArr1+no+String.fromCharCode(c);
                    subArray.push(s);
                }
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquareA1A5.test(testString)){
                console.log('Great, matched regSquareA1A5');
                var subArray = [];
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];
                var alpha = chlidArr2.split("-")[0].replace(/[^A-Z\.]+/gi, '');
                var sourceDigit = chlidArr2.split("-")[0].replace(/[^0-9\.]+/gi, '');
                var targetDigit = chlidArr2.split("-")[1].replace(/[^0-9\.]+/gi, '');
                console.log('remove digit',alpha, 'frist alpha:' ,sourceDigit, 'target',targetDigit );
                console.log(chlidArr2);
                for (let c = sourceDigit; c <= targetDigit ; c++) {
                    var s = chlidArr1+alpha+c;
                    subArray.push(s);
                }
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquareDigit.test(testString)){
                console.log('Great, matched regSquareDigit',testString);   
                var subArray = [];            
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];
                var no1 = chlidArr2.split("-")[0];
                var no2 = chlidArr2.split("-")[1].replace(/[\[\]']+/g, '');
                console.log(no1, no2);
                
                for (let c = no1; c <= no2; c++) {
                    var s = chlidArr1+' '+ c;
                    subArray.push(s);
                }
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquareDigitEven.test(testString)){
                console.log('Great, matched regSquareDigitEven',testString);  
                var subArray = [];             
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];
                var no1 = chlidArr2.split("-")[0];
                var no2 = chlidArr2.split("-")[1].replace(/[\[\]Even']+/g, '');                
                for (let c = no1; c <= no2; c++) {
                    if((c%2) == 0){
                        var s = chlidArr1+' '+ c;
                        subArray.push(s);
                    }
                }
                object.push({'address':testString,'subAddress':subArray});
            }

            if(regSquareDigitOdd.test(testString)){
                console.log('Great, matched regSquareDigitOdd');
                var subArray = [];
                var chlidArr1 = testString.split("[")[0];
                var chlidArr2 = testString.split("[")[1];
                var no1 = chlidArr2.split("-")[0];
                var no2 = chlidArr2.split("-")[1].replace(/[\[\]Odd']+/g, '');                
                for (let c = no1; c <= no2; c++) {
                    if(!(c%2) == 0){
                        var s = chlidArr1+' '+ c;
                        subArray.push(s);
                    }
                }
                object.push({'address':testString,'subAddress':subArray});
            }


            

            // Render location suggestion list
            jQuery.each( object, function( i, val ) {
       
                console.log('key:',i , 'values:--',val);
                console.log(val.address);
                var pid = 'parent'+i;
                $(".data").append('<li class='+pid+'><a class="badge badge-secondary" style="cursor:pointer;color:#fff"><i class="fa fa-chevron-right"></i> '+ val.address+'</a></li>');
                val.subAddress.forEach(item => {
                    console.log(item);   
                    $("."+pid).append('<ul class="child"><li><a class="badge badge-secondary badge-sm " style="cursor:pointer;color:#fff">'+item+'</a></li></ul>');           
                })
             });
        },
        error: function(data){
            console.log('Error loading XML data');
        }
    });

    var line1 = false;
    var line2 = false;
   

   
    
    // object.forEach(d => {
    //       var i = 1;
    //       var pid = 'parent'+ i;
    //       console.log(d.address);
    //       $(".data").append('<li class='+pid+'><a class="badge badge-info badge-sm " style="cursor:pointer; margin-left:-50px;color:#fff"><i class="fa fa-minus-square"></i> '+ d.address+'</a></li>');
    //       d.subAddress.forEach(item => {
    //           console.log(item);  
    //           $("."+pid).append('<ul class="child"><li><a class="badge badge-info badge-sm " style="cursor:pointer; margin-left:-39px;color:#fff">'+item+'</a></li></ul>');           
    //       })
        
    //     }
    // );
    
  

    

    $('.data').on('click','li .child',function(e) { 
        if(line1)
        $('#address').val(e.target.innerText);
        if(line2)
        $('#address2').val(e.target.innerText);
        $(".popup-overlay, .popup-content").removeClass("active");
        e.preventDefault();
    });

    $('body').on('keydown', '#address', function(e) {
        line1 = true;
        line2 = false;
        if (e.which == 9) {
            e.preventDefault();
            $(".popup-overlay, .popup-content").addClass("active");
        }
    });

    $('body').on('keydown', '#address2', function(e) {
        line2 = true;
        line1 = false;
        if (e.which == 9) {
            e.preventDefault();
            $(".popup-overlay, .popup-content").addClass("active");
        }
    });

    $(".data").on('click',function(e){
        // console.log('inside parent',e.target.parentElement.className);
        var parent = e.target.parentElement.className;
        $('.'+parent).children('.child').toggle();
        $('.child').children('.fa');
    });

    //removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
    $(".remove").on("click", function () {
        $(".popup-overlay, .popup-content").removeClass("active");
    });


}(jQuery));