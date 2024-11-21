import { useState, useEffect } from 'react';
import './assets/yazid.css'

function App() {
  const [isDrawing, setIsDrawing] = useState(false); // Apakah sedang menggambar
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 }); // Posisi awal
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 }); // Posisi saat ini
  const [rectangles, setRectangles] = useState([]); // Semua kotak yang sudah dibuat

  // Mulai menggambar (mousedown)
  const handleMouseDown = (event) => {
    if (event.target.closest('.topBar')) {
      return;
    }

    setIsDrawing(true);
    const { clientX, clientY } = event;
    setStartPosition({ x: clientX, y: clientY });
    setCurrentPosition({ x: clientX, y: clientY });
  };

  // Menggambar saat mouse digerakkan (mousemove)
  const handleMouseMove = (event) => {
    if (isDrawing) {
      const { clientX, clientY } = event;
      setCurrentPosition({ x: clientX, y: clientY });
    }
  };

  // Selesai menggambar (mouseup)
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setRectangles((prev) => [
        ...prev,
        { start: startPosition, end: currentPosition },
      ]);
    }
  };

  // Tambahkan event listener saat komponen dimuat
  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, startPosition, currentPosition]);

  return (
    <div className="App">
      <div className="topBar">
        sadf
      </div>
      <div className="canvas">
        {/* Tampilkan semua kotak */}
        {rectangles.map((rect, index) => {
          const style = {
            position: 'absolute',
            left: `${Math.min(rect.start.x, rect.end.x)}px`,
            top: `${Math.min(rect.start.y, rect.end.y)}px`,
            width: `${Math.abs(rect.end.x - rect.start.x)}px`,
            height: `${Math.abs(rect.end.y - rect.start.y)}px`,
            backgroundColor: 'rgba(0, 150, 255, 0.5)',
            border: '1px solid blue',
            borderRadius:'50%'
          };
          return <div key={index} style={style} />;
        })}

        {/* Kotak sementara (saat menggambar) */}
        {isDrawing && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(startPosition.x, currentPosition.x)}px`,
              top: `${Math.min(startPosition.y, currentPosition.y)}px`,
              width: `${Math.abs(currentPosition.x - startPosition.x)}px`,
              height: `${Math.abs(currentPosition.y - startPosition.y)}px`,
              backgroundColor: 'rgba(0, 150, 255, 0.3)',
              border: '1px dashed blue',
              borderRadius:'50%'
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
