import { useState, useEffect } from 'react';
import '../assets/yazid.css';

export default function Whiteboard() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState([]);
  const [circle, setCircle] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingShapeType, setDraggingShapeType] = useState(null);
  const [selectedShape, setSelectedShape] = useState('kotak');

  const handleMouseDown = (event) => {
    event.preventDefault(); // Mencegah aksi bawaan browser

    if (event.target.closest('.topBar')) return;

    const targetIndex = event.target.dataset.index;
    const targetShape = event.target.dataset.shape;

    if (targetIndex && targetShape) {
      const index = parseInt(targetIndex, 10);
      setDraggingIndex(index);
      setDraggingShapeType(targetShape);

      const sourceArray = targetShape === 'kotak' ? rectangles : circle;
      const rect = sourceArray[index];
      setDragOffset({
        x: event.clientX - Math.min(rect.start.x, rect.end.x),
        y: event.clientY - Math.min(rect.start.y, rect.end.y),
      });
      return;
    }

    setIsDrawing(true);
    const { clientX, clientY } = event;
    setStartPosition({ x: clientX, y: clientY });
    setCurrentPosition({ x: clientX, y: clientY });
  };

  const handleMouseMove = (event) => {
    event.preventDefault(); // Mencegah aksi bawaan browser

    if (isDrawing) {
      const { clientX, clientY } = event;
      setCurrentPosition({ x: clientX, y: clientY });
    }

    if (draggingIndex !== null && draggingShapeType) {
      const { clientX, clientY } = event;
      const sourceArray = draggingShapeType === 'kotak' ? rectangles : circle;
      const rect = sourceArray[draggingIndex];
      const deltaX = clientX - dragOffset.x;
      const deltaY = clientY - dragOffset.y;
      const width = Math.abs(rect.end.x - rect.start.x);
      const height = Math.abs(rect.end.y - rect.start.y);

      const updateFunction =
        draggingShapeType === 'kotak' ? setRectangles : setCircle;

      updateFunction((prev) =>
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

  const handleMouseUp = (event) => {
    event.preventDefault(); // Mencegah aksi bawaan browser

    if (isDrawing) {
      setIsDrawing(false);
      switch (selectedShape) {
        case 'kotak':
          setRectangles((prev) => [
            ...prev,
            { start: startPosition, end: currentPosition },
          ]);
          break;
        case 'lingkaran':
          setCircle((prev) => [
            ...prev,
            { start: startPosition, end: currentPosition },
          ]);
          break;
        default:
          break;
      }
    }

    if (draggingIndex !== null) {
      setDraggingIndex(null);
      setDraggingShapeType(null);
    }
  };

  const pilihBangunDatar = (bangunDatar) => {
    setSelectedShape(bangunDatar);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, startPosition, currentPosition, draggingIndex, dragOffset, rectangles, circle]);

  return (
    <div>
      <div className="topBar">
        <div
          className="kotak"
          style={selectedShape === 'kotak' ? { border: '3px solid black', boxSizing: 'border-box' } : {}}
          onClick={() => pilihBangunDatar('kotak')}
        ></div>
        <div
          className="lingkaran"
          style={selectedShape === 'lingkaran' ? { border: '3px solid black', boxSizing: 'border-box' } : {}}
          onClick={() => pilihBangunDatar('lingkaran')}
        ></div>
      </div>
      <div className="canvas">
        {rectangles.map((rect, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${Math.min(rect.start.x, rect.end.x)}px`,
              top: `${Math.min(rect.start.y, rect.end.y)}px`,
              width: `${Math.abs(rect.end.x - rect.start.x)}px`,
              height: `${Math.abs(rect.end.y - rect.start.y)}px`,
              backgroundColor: 'rgba(0, 150, 255, 0.5)',
              cursor: 'grab',
            }}
            className='rectangle'
            data-index={index}
            data-shape="kotak"
          />
        ))}
        {circle.map((rect, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${Math.min(rect.start.x, rect.end.x)}px`,
              top: `${Math.min(rect.start.y, rect.end.y)}px`,
              width: `${Math.abs(rect.end.x - rect.start.x)}px`,
              height: `${Math.abs(rect.end.y - rect.start.y)}px`,
              backgroundColor: 'rgba(0, 150, 255, 0.5)',
              borderRadius: '50%',
              cursor: 'grab',
            }}
            data-index={index}
            className='circle'
            data-shape="lingkaran"
          />
        ))}
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
              borderRadius: selectedShape === 'lingkaran' ? '50%' : 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
