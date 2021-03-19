$(document).ready(function () {
    $("#resultBlock").hide();
    $("#errorBlock").hide();
    $("#result").attr("href", '').html('');
});
 
$(document).on("click", "#submit", function () {
    $("#resultBlock").hide();
    $("#errorBlock").hide();
    $("#inlineOutput").text(''); // inline output div
    $("#status").text(''); // status div
 
    var apiKey = $("#apiKey").val().trim(); //Get your API key at https://app.pdf.co/documentation/api
 
    var formData = $("#form input[type=file]")[0].files[0]; // file to upload
    var toType = $("#convertType").val(); // output type
    var isInline = $("#outputType").val() == "inline"; // if we need output as inline content or link to output file

    $("#status").html('Requesting presigned url for upload... &nbsp;&nbsp;&nbsp; <img src="ajax-loader.gif" />');

    $("#status").html('Processing... &nbsp;&nbsp;&nbsp; <img src="ajax-loader.gif" />');

    $.ajax({
        url: 'https://api.pdf.co/v1/pdf/convert/to/'+toType+'?url=https://drive.google.com/file/d/1G9Hoe4JI7b2mkMDsWLL_tO4pmKKY9kOU/view?usp=sharing' + isInline,
        type: 'POST',
        headers: {'x-api-key': apiKey},
        success: function (result) { 

            $("#status").text('done converting.');

            // console.log(JSON.stringify(result));
            
            $("#resultBlock").show();

            if (isInline)
            {                                    
                $("#inlineOutput").text(result['body']);
            }
            else {
                $("#result").attr("href", result['url']).html(result['url']);
            }
            
        }
    });
});
 