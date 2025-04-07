const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      gsi: {
        type: 'raster',
        tiles: [
          'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
      }
    },
    layers: [
      {
        id: 'gsi-layer',
        type: 'raster',
        source: 'gsi',
        minzoom: 0,
        maxzoom: 18
      }
    ]
  },
  center: [135.6, 34.8], // 東京駅付近
  zoom: 10
});


map.on('load', async () => {
  // Add an image to use as a custom marker
  const image = await map.loadImage('./src/data/sakura_icon.png');
  map.addImage('custom-marker', image.data);
  // サークル設定
  map.addSource('sakura_point', {
      type: 'geojson',
      data: './src/data/sakura.geojson'
  });
  // ポリゴン読み込み
  map.addSource('hirakata_city', {
      type: 'geojson',
      data: './src/data/hirakata_city.geojson'
  });
  // ポリゴンのスタイル設定
  map.addLayer({
    id: 'hirakata_city',
    type: 'fill',
    source: 'hirakata_city',
    paint: {
      'fill-color': '#888800',
      'fill-opacity': 0.5,
    }
  });
  // スタイル設定
    map.addLayer({
      id: 'sakura_point',
      type: 'symbol',
      source: 'sakura_point',
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.06
      }
    });

});

map.addControl(new maplibregl.NavigationControl(), 'top-right');