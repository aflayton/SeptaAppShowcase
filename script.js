var appList = document.getElementById("appList");
var modal = document.getElementById("modal");
var content = document.getElementById("content");
var search = document.getElementById("search");
var filterDiv = document.getElementById("filter");
var checkboxarea = document.getElementById("checkboxarea");

var httpRequest = new XMLHttpRequest();

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
/*
function showFilterModal()
{
	content.innerHTML = "";
	content.appendChild(checkboxarea);
	checkboxarea.hidden = false;
	modal.style.display = "block";
	
	checkboxarea.addEventListener('click', checkFilter, false);
	function checkFilter(e)
	{
		
		var divs = appList.getElementsByTagName("div");
		if (e.target.checked)
		{
			for (var j = 0; j < divs.length; j++)
			{
				var tagArray = divs[j].dataset.tags.split(",");
				for (tag in tagArray)
				{
					if (e.target.value == tagArray[tag])
					{
						divs[j].hidden = false;
					}
				}
			}
		}
		else
		{
			for (var j = 0; j < divs.length; j++)
			{
				var tagArray = divs[j].dataset.tags.split(",");
				for (tag in tagArray)
				{
					if (e.target.value == tagArray[tag])
					{
						divs[j].hidden = true;
					}
				}
			}
		
		}
		//e.stopPropagation();
		
	}
}
*/
//filterDiv.onclick = showFilterModal;

function filter(keep)
{
	var allFlag;
	if (!keep)
	{
		allFlag = true;
	}
	var divs = appList.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++)
	{
		if (!divs[i].id.toLowerCase().match(keep.toLowerCase()))
		{
			divs[i].hidden = true;
		}
		
		else
		{
			divs[i].hidden = false;
		}
		
		if (allFlag)
		{
			divs[i].hidden = false;
		}
	}
}

search.oninput = function()
{
	var query = search.value;
	filter(query);
};

window.onclick = function(event)
{
	if (event.target == modal) 
	{
		modal.style.display = "none";
	}
};

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
					appList.innerHTML += "<div id='" + jsonData[i]['name'] + "' data-tags=" + JSON.stringify(jsonData[i]['tags']) + " class='col-4 appDiv'>" +
											"<h3>" + jsonData[i]['name'] + "</h3>" +
											"<img class='appImg' src=" + jsonData[i]['imgUrl'] + " onclick='showModal(" + JSON.stringify(jsonData[i]) + ")'>" + 
										"</div>";
			}
		}
	}
};
httpRequest.open('GET', 'appData.json', true);
httpRequest.send();