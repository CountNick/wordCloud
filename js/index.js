// console.log('d3: ', d3.layout.cloud)
// require('dotenv').config()

// import {} from '../node_modules/dotenv/config.js'
// require('dotenv').config()

//statically import Api key from .env
const apiKey = process.env.API_KEY;


fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=Darkthrone&api_key=${apiKey}&format=json`)
    .then(res => {
        return res.json()
    })
    .then(data => organiseData(data))
    .then(organiseData => makeWordCloud(organiseData))


function organiseData(data){

    const artistTopTracks = data.toptracks.track.map(track => {
        return{
            rank: +track['@attr'].rank,
            song: track.name,
            playCount: +track.playcount,
            listeners: +track.listeners,   
            artist: track.artist.name
            
        }
        
    })
    
    return artistTopTracks
}


function makeWordCloud(data){

    console.log('data: ', data)

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

//const yValue = d => d.origin;
const margin = { top: 40, right: 30, bottom: 150, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const layout = d3.layout.cloud()
    .size([width, height])
    .words(data.map( d => {return {text: d.song, size: d.rank, playCount: d.playCount, listeners: d.listeners, artist: d.artist}}))
    .padding(5)
    .rotate(() => {return ~~(Math.random() * 2 ) * 90})
    .fontSize(d => {return d.size})
    .on('end', draw);
layout.start();
    


function draw(words){
    
    const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => {
        console.log('d: ',d)

        return '<h2>'+ d.artist +'</h2> <br> <strong>track: ' + d.text +'</strong>'

    });

    

    svg
    .append('g')
    .call(tip)
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll('text')
    .data(words)
        .enter()
        .append('text')
        .style('font-size', d => d.size)
        .style('fill', '#FFFFFF')
        .attr('text-anchor', 'middle')
        .style("font-family", "OldLondon")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
        .text(d => d.text)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
}

}