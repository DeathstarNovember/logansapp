import './App.css'

import { useState } from 'react'

const colors = [
  '#ffffff',
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#000000',
]

const initialImageSize = 10

const colorModes = ['single', 'flood'] as const

type ColorMode = typeof colorModes[number]

type Pixel = {
  id: number
  color: string
}

function App() {
  const [colorMode, setColorMode] = useState<ColorMode>(colorModes[0])

  const [clearConfirmVisible, setClearConfirmVisible] = useState<boolean>(false)

  const [dragging, setDragging] = useState<boolean>(false)

  const [imageSize, setImageSize] = useState(initialImageSize)

  const initialPixels = new Array(initialImageSize * initialImageSize)
    .fill({ color: colors[0] })
    .map((p, i) => {
      return { ...p, id: i }
    })

  const [pixels, setPixels] = useState<Pixel[]>(initialPixels)

  const [selectedColor, setSelectedColor] = useState<string>(colors[0])

  const increaseImageSize = () => {
    const newPixels = [
      ...pixels,
      ...new Array(imageSize * 2 + 1).fill({ color: colors[0] }),
    ].map((p, i) => {
      return { ...p, id: i }
    })
    setPixels(newPixels)
    setImageSize(imageSize + 1)
  }

  const decreaseImageSize = () => {
    if (imageSize > 1) {
      setPixels(pixels.slice(0, imageSize * imageSize - (imageSize * 2 - 1)))
      setImageSize(imageSize - 1)
    }
  }

  const showConfirmationModal = () => {
    setClearConfirmVisible(true)
  }

  const hideConfirmationModal = () => {
    setClearConfirmVisible(false)
  }

  const selectColor = (color: string) => {
    setSelectedColor(color)
  }

  const changePixelColor = (pixel: Pixel) => {
    if (colorMode === 'flood') {
      const colorToReplace = pixel.color
      const newPixels = pixels.map((p) => {
        if (p.color === colorToReplace) {
          return { ...p, color: selectedColor }
        } else {
          return p
        }
      })
      setPixels(newPixels)
    } else {
      const newPixels = pixels.map((p) => {
        if (p.id === pixel.id) {
          return { ...p, color: selectedColor }
        } else {
          return p
        }
      })
      setPixels(newPixels)
    }
  }

  const changeColorMode = (mode: ColorMode) => {
    setColorMode(mode)
  }

  const clearImage = () => {
    setPixels(initialPixels)
    hideConfirmationModal()
  }

  const confirmClearImage = () => {
    showConfirmationModal()
  }
  return (
    <div className="App">
      <div
        style={{
          backgroundColor: '#282c34',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          gap: 5,
        }}
      >
        <div>
          {colorModes.map((mode) => {
            return (
              <button
                style={{
                  backgroundColor: mode === colorMode ? 'blue' : undefined,
                }}
                key={mode}
                onClick={() => changeColorMode(mode)}
              >
                {mode}
              </button>
            )
          })}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${colors.length}, 1fr)`,
          }}
        >
          {colors.map((color) => {
            const isSelected = color === selectedColor
            return (
              <div
                key={`color${color}`}
                style={{
                  backgroundColor: color,
                  height: 100,
                  width: 100,
                  borderRadius: '50%',
                  border: isSelected ? 'solid white 2px' : 'none',
                }}
                onClick={() => selectColor(color)}
              />
            )
          })}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${imageSize}, 1fr)`,
            gap: 1,
          }}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          {pixels.map((pixel) => {
            return (
              <div
                key={`pixel${pixel.id}`}
                style={{
                  backgroundColor: pixel.color,
                  height: 800 / imageSize,
                  width: 800 / imageSize,
                }}
                onClick={() => changePixelColor(pixel)}
                onMouseEnter={() => {
                  if (dragging) {
                    changePixelColor(pixel)
                  }
                }}
              />
            )
          })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flex: 1,
            height: 50,
          }}
        >
          <button
            style={{ borderRadius: '50%', height: 50, width: 50 }}
            onClick={decreaseImageSize}
          >
            -
          </button>
          <button style={{ height: 50 }} onClick={confirmClearImage}>
            Clear
          </button>
          <button
            style={{ borderRadius: '50%', height: 50, width: 50 }}
            onClick={increaseImageSize}
          >
            +
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#c3ff003b',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          visibility: clearConfirmVisible ? 'visible' : 'hidden',
        }}
      >
        <div>
          <div style={{ fontSize: 32 }}>
            Are you sure you want to erase your hard work?
          </div>
          <button onClick={hideConfirmationModal}>cancel</button>
          <button onClick={clearImage}>confirm</button>
        </div>
      </div>
    </div>
  )
}

export default App
