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

$(".unsave").on("click",  function() {

  var thisId = $(this).attr("data-id");
  var id = $(this).parent()
  id.empty();

console.log(thisId)

  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
    
  })
  
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      console.log("Should Turn FALSE")

    });

});


$(".readanote").on("click", ()=>{
  console.log("PPPPPPP");

  $("#myModal").modal()
})

$(".leaveanote").on("click", ()=>{
  console.log("llllllll");

  $("#myModal").modal()
})


$(".buttonSave").on("click", ()=>{
console.log("SAVE CLICK")
var n = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId
    
  })
  
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      console.log("HERE")

    });
})

// $.getJSON("/saved", function (data) {
// console.log("GGGGGGGGGGGGGGGGGGGG")
//   for (var i = 0; i < data.length; i++) {

//     $("#article").append(data);
//   }
// });