import { Template } from 'meteor/templating';

import './main.html';

const giphyKey = "yktqUKMJUCe82Auqg8hXieKeTdRAEPsT";
const limitOffset = 12;

Template.giphyContainer.onCreated = () =>
{
	Session.set('giphyImages', []);	
};

Template.giphyContainer.rendered = () =>
{
	// init the first demo
	getGiphyImages(0);
};

Template.giphyContainer.helpers(
{
	giphyImages: () =>
	{
		return Session.get('giphyImages');
	}
});

Template.giphyContainer.events(
{
	'click .js-activate-s-image-box': (e) => 
	{
        var imgPath = $(e.currentTarget).data('full-image-src');
        if (imgPath) {
            sImageBox.open(imgPath, {
                originalHeight: true,
                originalWidth: true,
                animation: ''
            });
        }
    }
});

Template.buttonLoadMore.events(
{
  'click button': (event, instance) => {
	// increment the counter when button is clicked
	var giphyImages = Session.get('giphyImages') || [];
	
	getGiphyImages(giphyImages.length);
  },
});

// https://api.giphy.com/v1/gifs/trending?api_key=yktqUKMJUCe82Auqg8hXieKeTdRAEPsT&limit=25&rating=g=
var getGiphyImages = (offset) => 
{
	offset = offset || 0;
	var url = "https://api.giphy.com/v1/gifs/trending";

	HTTP.call('GET', url, {params: {
		api_key: giphyKey,
		limit: limitOffset,
		offset: offset,
		rating: 'g'
	}}, (err, res) =>
	{
		// console.log(err, res);
		if (res.data?.data)
		{			
			var giphyImages = Session.get('giphyImages') || [];
			giphyImages = union(giphyImages, res.data.data);
			
			// update new data
			Session.set('giphyImages', giphyImages);
		}		
	});
};

var union = (array, a) =>
{	
	if (!Array.isArray(a) || !a.length)
	{
		return array;
	}

	var r = array.slice(0);

	a.forEach(function(i) 
	{ 
		if (r.indexOf(i) < 0) r.push(i); 
	});

	return r;
};