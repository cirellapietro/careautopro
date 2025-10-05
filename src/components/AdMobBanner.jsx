import React, { useEffect } from 'react'

const AdMobBanner = ({ adUnitId, size = 'BANNER' }) => {
  useEffect(() => {
    // Inizializza AdMob (per versione mobile/PWA)
    const initializeAds = async () => {
      if (window.admob) {
        try {
          await window.admob.start()
          const banner = new window.admob.BannerAd({
            adUnitId: adUnitId,
          })
          await banner.show()
        } catch (error) {
          console.log('AdMob error:', error)
        }
      }
    }

    initializeAds()
  }, [adUnitId])

  return (
    <div className="ad-container">
      <div id="admob-banner" className="ad-responsive"></div>
    </div>
  )
}

export default AdMobBanner
