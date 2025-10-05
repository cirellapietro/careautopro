import React, { useEffect } from 'react'

const AdSenseBanner = ({ slot, format = 'auto', responsive = true }) => {
  useEffect(() => {
    // Carica AdSense script
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5545202856432487'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Inizializza ads
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.log('AdSense init error:', error)
    }

    return () => {
      // Cleanup
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="ad-container">
      <ins 
        className="adsbygoogle ad-banner"
        style={ display: 'block', textAlign: 'center' }
        data-ad-client="ca-pub-5545202856432487"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

export default AdSenseBanner
