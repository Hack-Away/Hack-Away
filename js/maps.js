 function initMap() {
        const mapContainer = document.getElementById("map")
            if (mapContainer) {
              window.restmap = new RestMap(mapontainer)
              window.resmap.centerOnBrowswer()
            }
        }
        class RestMap {
            constructor(container) {
                const center = { 
                lat: 41.39495744097877, 
                lng: 2.1751778671137836 
                };
                this.map = new google.maps.map(container, {
                    zoom: 13,
                    center
                });
            }

        centerOnBrowser(){
            if (!navigator.geolocation) return
                navigator.geolocation.getCurrentPosition((position) => {
                    const center = {
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                    };

                    this.map.setCenter(center)
                });
            }
        }
          