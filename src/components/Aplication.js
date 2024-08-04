import '../App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

export const Aplication = () => {
    const { key } = useParams();
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Redirige a una clave predeterminada si 'key' está vacío o no es válido
        if (!key || key === 'default') {
            navigate('/XwGqmmBuEvRcDaeSpL1CQng3');
        } else {
            setApiKey(key);
        }
    }, [key, navigate]);

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = 1200;
                canvas.height = 1200;
                ctx.drawImage(img, 0, 0, 1200, 1200);
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            };

            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const removeBackground = (file, apiKey) => {
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        return axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'blob',
            headers: {
                'X-Api-Key': apiKey
            }
        }).then(response => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(response.data);
            });
        }).catch(error => {
            console.error('Error removing background:', error.response ? error.response.data : error.message);
            throw error;
        });
    };

    const addWhiteBackground = (dataUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = 1200;
                canvas.height = 1200;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 1200, 1200);
                const finalDataUrl = canvas.toDataURL('image/png');
                resolve(finalDataUrl);
            };

            img.onerror = reject;
            img.src = dataUrl;
        });
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        setLoading(true);

        try {
            const processedImages = await Promise.all(files.map(async (file) => {
                const originalImage = await resizeImage(file);
                const bgRemovedImage = await removeBackground(file, apiKey);
                const whiteBgImage = await addWhiteBackground(bgRemovedImage);
                return { original: originalImage, whiteBg: whiteBgImage };
            }));

            setSelectedImages(processedImages);
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Hubo un error procesando las imágenes. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container-flex'>
            <div className='head'>
                <div className='container-nav'>
                    <nav>
                        <Link to="/XwGqmmBuEvRcDaeSpL1CQng3"><p>Key 1</p></Link>
                        <Link to="/miBB92pGDcHW8L6xRM8NFC6d"><p>Key 2</p></Link>
                        <Link to="/2ZxaTuhX8UbPpbQxAXyaJx3m"><p>Key 3</p></Link>
                        <Link to="/m4kKHDaHmCv17WFcRLcsiCq4"><p>Key 4</p></Link>
                    </nav>
                </div>
                <div className='container-title'>
                    <h1>Bienvenido a FastMeli</h1>
                </div>
            </div>
            <div className='container-p'>
                <p>Subí más rápido tus fotos de MercadoLibre</p>
            </div>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={!apiKey} // Deshabilita el input hasta que la clave de la API esté lista
            />

            {loading && <p>Procesando imágenes...</p>}

            <div className='container-imgs'>
                {selectedImages.map((imageSet, index) => (
                    <div className='container-flex-img' key={index}>
                        <div className='img-original'>
                            <p>Original:</p>
                            <img 
                                src={imageSet.original} 
                                alt={`preview original ${index}`} 
                                width="300" 
                            />
                            <a href={imageSet.original} download={`imagen_original_${index}.png`}>
                                <button className='download'>Descargar Original</button>
                            </a>
                        </div>
                        <div className='img-fondo-blanco'>
                            <p>Fondo Blanco:</p>
                            <img 
                                src={imageSet.whiteBg} 
                                alt={`preview white background ${index}`} 
                                width="300" 
                            />
                            <a href={imageSet.whiteBg} download={`imagen_white_bg_${index}.png`}>
                                <button className='download'>Descargar Fondo Blanco</button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}