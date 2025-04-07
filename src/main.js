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
  center: [135.66, 34.82], // 東京駅付近
  zoom: 11.5
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
  map.addSource('jinko_mesh', {
      type: 'geojson',
      data: './src/data/jinko_mesh.geojson'
  });
  // ポリゴンのスタイル設定
  map.addLayer({
    id: 'jinko_mesh',
    type: 'fill',
    source: 'jinko_mesh',
    paint: {
      "fill-color": [
        "step",
        ["get", "PTN_2025"],
        "#cccccc",  // 0以下
        200, "#ffbfbf",  // 20以上→青
        500, "#ff9999",  // 40以上→緑
        800, "#ff6666",  // 40以上→緑
        1500, "#ff3333",  // 60以上→黄
        1800, "#ff0000"   // 80以上→赤
      ],
      "fill-opacity": 0.6
    }
  });
  map.addLayer({
    id: 'hirakata_city',
    type: 'line',
    source: 'hirakata_city',
    paint: {
      "line-color": "#ff3300",
      "line-width": 2
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

  // Add a checkbox
    document.getElementById('toggle-jinko').addEventListener('change', (e) => {
      map.setLayoutProperty(
        'jinko_mesh',
        'visibility',
        e.target.checked ? 'visible' : 'none'
      );
    });
    
    document.getElementById('toggle-city').addEventListener('change', (e) => {
      map.setLayoutProperty(
        'hirakata_city',
        'visibility',
        e.target.checked ? 'visible' : 'none'
      );
    });
    
    document.getElementById('toggle-sakura').addEventListener('change', (e) => {
      map.setLayoutProperty(
        'sakura_point',
        'visibility',
        e.target.checked ? 'visible' : 'none'
      );
    });

});

map.addControl(new maplibregl.NavigationControl(), 'top-right');