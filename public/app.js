// A GET request to scrape the echojs website
$(".saved").on("click",  function() {

  var thisId = $(this).attr("data-id");

console.log(thisId)


  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/submit/" + thisId
    
  })
  
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      console.log("HERE")

    });

});

$.getJSON("/saved", function (data) {
console.log("GGGGGGGGGGGGGGGGGGGG")
  for (var i = 0; i < data.length; i++) {

    $("#article").append(data);
  }
});