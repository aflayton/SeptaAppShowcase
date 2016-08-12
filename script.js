/**
	OVERVIEW
	This script mostly deals with handling the AJAX loading of the 'appData.json' file to populate the 'appList' div,
	as well as handling functionality of modals and onclick events.
*/

/**
	DATA
	document level object references
*/
var appList = document.getElementById("appList");
var modal = document.getElementById("modal");
var content = document.getElementById("content");
var search = document.getElementById("search");
var filterDiv = document.getElementById("filter");
var checkboxarea = document.getElementById("checkboxarea");

var httpRequest = new XMLHttpRequest();

/**
	PARAM
	obj - an entry in appData.json 
*/
function showModal(obj)
{
	content.innerHTML = "";
	
	content.innerHTML += "<img src=" + obj['imgUrl'] + "> <br>" +
							"<h2>" + obj['name'] + "</h2>"+
							"<h4>By: " + obj['author'] + " (<a href='mailto:" + obj['email'] + "'>" + obj['email'] + "</a>)</h4>" +
							"<p>" + obj['description'] + "</p> <br>" +
							"<a href="+ obj['url'] +"><button class='linkBtn'>Link</button></a>";
	modal.style.display = "block";
	
}

/**
	event handler to show checkboxarea in modal when filter div is clicked
*/
function showFilterModal()
{
	content.innerHTML = "";
	content.appendChild(checkboxarea);
	checkboxarea.hidden = false;
	modal.style.display = "block";
	
	var checks = checkboxarea.getElementsByTagName("input");
	
	var select = document.getElementById("select");
	var unselect = document.getElementById("unselect");
	
	/**
		checks all checkboxes
	*/
	select.onclick = function()
	{
		for (var k = 0; k < checks.length; k++)
		{
			checks[k].checked = true;
		}
	};
	
	/**
		unchecks all checkboxes
	*/
	unselect.onclick = function()
	{
		for (var k = 0; k < checks.length; k++)
		{
			checks[k].checked = false;
		}
	};
	
	
	checkboxarea.addEventListener('click', checkFilter, false);
	/**
		hides all subdivs in appList div and then shows the relevent ones based on filter
	*/
	function checkFilter(e)
	{
		
		var divs = appList.getElementsByTagName("div");
		
		for (var j = 0; j < divs.length; j++)
		{
			divs[j].hidden = true;
			for (var k = 0; k < checks.length; k++)
			{
				if (checks[k].checked)
				{
					if (checks[k].value == divs[j].dataset.platform || checks[k].value == divs[j].dataset.price || checks[k].value == divs[j].dataset.source)
					{
						divs[j].hidden = false;
					}
				}
			}
		}
	}
	
}

filterDiv.onclick = showFilterModal;

/**
	filters appList based on contents of searchbox found in apps' titles
*/
function searchFilter(keep)
{
	var divs = appList.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++)
	{
		if (!divs[i].id.toLowerCase().match(keep.toLowerCase())) // both are lowercased before being matched
		{
			divs[i].hidden = true;
		}
		
		else
		{
			if (!divs[i].hidden)
			{
				divs[i].hidden = false;
			}
		}
	}
}

/**
	event handler for when searchbox contents change
*/
search.oninput = function()
{
	var query = search.value;
	searchFilter(query);
};

/**
	closes modal when the gray part is clicked
*/
window.onclick = function(event)
{
	if (event.target == modal) 
	{
		modal.style.display = "none";
	}
};

/**
	asynchronous loading event handler
*/
httpRequest.onreadystatechange = function()
{
	if (httpRequest.readyState === XMLHttpRequest.DONE)
	{
		if (httpRequest.status === 200)
		{
			var rawData = httpRequest.responseText;
			var jsonData = JSON.parse(rawData);
			for (var i = 0; i < jsonData.length; i++)
			{
					appList.innerHTML += "<div id='" + jsonData[i]['name'] + "' data-platform=" + jsonData[i]['platforms'] + " data-price=" + jsonData[i]['pricing'] + " data-source=" + jsonData[i]['source'] + " class='col-4 appDiv'>" +
											"<h3>" + jsonData[i]['name'] + "</h3>" +
											"<img class='appImg' src=" + jsonData[i]['imgUrl'] + " onclick='showModal(" + JSON.stringify(jsonData[i]) + ")'>" + 
										"</div>";
			}
		}
	}
};
httpRequest.open('GET', 'appData.json', true);
httpRequest.send();