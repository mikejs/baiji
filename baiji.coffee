$(window).hashchange(->
  if location.hash == "#legislator_list"
    state = $("#select-choice-1").val()
    url = "http://openstates.sunlightlabs.com/api/v1/legislators/?state=" + state + "&apikey=sunlight9&chamber=upper"

    $("#legislator_listview").empty()
    $.ajax(
      url: url,
      dataType: 'jsonp',
      success: (data) ->
        for leg in data
          html = "<li>"
          if leg.photo_url
            html += "<img src='" + leg.photo_url + "' />";
          html += "<div><a href='#index'>" + leg['full_name'] + "</a>"
          html += "<p class='ul-li-aside ul-li-desc'>" + leg.party + "</p></div>"
          html += "</li>"

          $("#legislator_listview").append(html)

        $("#legislator_listview").listview()
      )
)