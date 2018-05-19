$(function() {
    $("#rsvpform").submit( function(event) {
        event.preventDefault();

        $.ajax({
            url: "https://l52536zkwh.execute-api.us-east-1.amazonaws.com/prod/",
            data: JSON.stringify(formToJson(this)),
            dataType: "json",
            method:"POST",
            contentType:"application/json",
            success: function(data, status, xhr) {
                resultDebounceSubmitButton("Sent!", "success");
            },
            error: function(data, status, xhr) {
                resultDebounceSubmitButton("Failed to send. Please try again.", "error");
            }
        });
    });
});

function resultDebounceSubmitButton(stateText, resultClass) {
    $('#submit').val(stateText);
    $('#submit').attr('disabled', 'disabled');
    $('#submit').addClass(resultClass);
    setTimeout(function() {
        $('#submit').val("Submit");
        $('#submit').removeAttr('disabled');
        $('#submit').removeClass(resultClass);
    }, 5000);
}

function formToJson(form) {
    var json = {};
    var array = $(form).serializeArray();
    $.each(array, function(i, e) {
        json[e.name] = e.value || "N/A";
    });
    return json;
}