$(function() {
    $("#rsvpform").submit( function(event) {
        event.preventDefault();

        $.ajax({
            url: "https://l52536zkwh.execute-api.us-east-1.amazonaws.com/prod/",
            data: JSON.stringify(formToJson(this)),
            dataType: "json",
            method:"POST",
            contentType:"application/json"
        });
    });
});

function formToJson(form) {
    var json = {};
    var array = $(form).serializeArray();
    $.each(array, function(i, e) {
        json[e.name] = e.value || "";
    });
    return json;
}