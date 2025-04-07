

const initialCenter = [135.66, 34.82];
const initialZoom = 11.5;

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


  // 表示可能な地理範囲（西南端と北東端）
  maxBounds: [
    [135.5, 34.6], // 南西（最小経度, 最小緯度）
    [136.0, 35.0]  // 北東（最大経度, 最大緯度）
  ],
  minZoom: 10,
  maxZoom: 16,


  center: initialCenter,
  zoom: initialZoom,
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
        "#cccccc", 
        200, "#ffbfbf", 
        500, "#ff9999",  
        800, "#ff6666",  
        1500, "#ff3333",  
        1800, "#ff0000"   
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
    // 凡例の表示切替
    document.getElementById('toggle-jinko').addEventListener('change', (e) => {
      const visible = e.target.checked;
    
      // レイヤーの表示切替
      map.setLayoutProperty('jinko_mesh', 'visibility', visible ? 'visible' : 'none');
    
      // 凡例の表示切替
      document.getElementById('legend-jinko').style.display = visible ? 'block' : 'none';
    });

});

map.on('click', 'jinko_mesh', (e) => {
  // クリックされた最初のフィーチャを取得
  const feature = e.features[0];

  // STN_2025 の値を取得（なければ 'なし'）
  const stnValue = feature.properties.PTN_2025 || '情報なし';

  // ポップアップを作成・表示
  new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`<strong>PTN_2025:</strong> ${stnValue}`)
    .addTo(map);
});

map.on('mouseenter', 'jinko_mesh', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'jinko_mesh', () => {
  map.getCanvas().style.cursor = '';
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// 折りたたみ機能：クリックで切り替え
document.querySelector('.toggle-header').addEventListener('click', () => {
  const toggle = document.getElementById('layer-toggle');
  toggle.classList.toggle('expanded');

  // 見出しの ▶ or ▼ を切り替え
  const title = toggle.querySelector('.toggle-header');
  if (toggle.classList.contains('expanded')) {
    title.textContent = '▼ レイヤー表示切替';
  } else {
    title.textContent = '▶ レイヤー表示切替';
  }
});

document.getElementById('reset').addEventListener('click', () => {
  map.flyTo({
    center: initialCenter,
    zoom: initialZoom,
    essential: true
  });
});