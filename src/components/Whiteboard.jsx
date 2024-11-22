import { useState, useEffect } from 'react';
import '../assets/yazid.css'

export default function Whiteboard() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null); // Index elemen yang sedang di-drag
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset saat drag dimulai
  const [selectedShape, setSelectedShape] = useState('')


  const handleMouseDown = (event) => {
    // Jika klik pada elemen .topBar, abaikan
    if (event.target.closest('.topBar')) return;

    const targetIndex = event.target.dataset.index;

    // Jika klik pada kotak, mulai drag
    if (targetIndex) {
      const index = parseInt(targetIndex, 10);
      setDraggingIndex(index);
      const rect = rectangles[index];
      setDragOffset({
        x: event.clientX - Math.min(rect.start.x, rect.end.x),
        y: event.clientY - Math.min(rect.start.y, rect.end.y),
      });
      return;
    }

    // Jika klik pada kanvas, mulai menggambar
    setIsDrawing(true);
    const { clientX, clientY } = event;
    setStartPosition({ x: clientX, y: clientY });
    setCurrentPosition({ x: clientX, y: clientY });
  };

  const handleMouseMove = (event) => {
    if (isDrawing) {
      const { clientX, clientY } = event;
      setCurrentPosition({ x: clientX, y: clientY });
    }

    if (draggingIndex !== null) {
      const { clientX, clientY } = event;
      const rect = rectangles[draggingIndex];
      const deltaX = clientX - dragOffset.x;
      const deltaY = clientY - dragOffset.y;
      const width = Math.abs(rect.end.x - rect.start.x);
      const height = Math.abs(rect.end.y - rect.start.y);

      setRectangles((prev) =>
        prev.map((r, i) =>
          i === draggingIndex
            ? {
                start: { x: deltaX, y: deltaY },
                end: { x: deltaX + width, y: deltaY + height },
              }
            : r
        )
      );
    }
  };


  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setRectangles((prev) => [
        ...prev,
        { start: startPosition, end: currentPosition },
      ]);
    }

    if (draggingIndex !== null) {
      setDraggingIndex(null);
    }
  };

  const pilihBangunDatar = (bangunDatar) => {
    setSelectedShape(bangunDatar)
  }


  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, startPosition, currentPosition, draggingIndex, dragOffset, rectangles]);

  

  return (
      <div>
        <div className="topBar">
          <div className="kotak" style={selectedShape == 'kotak' ? {border:'3px solid black',boxSizing:'border-box'} : {}} onClick={()=>{pilihBangunDatar("kotak")}}></div>
          <div className="lingkaran" style={selectedShape == 'lingkaran' ? {border:'3px solid black',boxSizing:'border-box'} : {}} onClick={()=>{pilihBangunDatar("lingkaran")}}></div>
          <div className="segitiga" style={selectedShape == 'segitiga' ? {borderLeft: '10px solid transparent',borderRight: '10px solid transparent',borderBottom: '20px solid black',boxSizing: 'border-box',boxShadow: '0 0 0 3px black'} : {}} onClick={()=>{pilihBangunDatar("segitiga")}}></div>
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
            borderRadius: '50%',
            cursor: 'grab',
          };
          return <div key={index} style={style} data-index={index} className='element' />;
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
              borderRadius: '50%',
            }}
          />
        )}
      </div>
      </div>
  );
}