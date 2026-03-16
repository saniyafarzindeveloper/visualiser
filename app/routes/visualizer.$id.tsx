import { generate3DView } from "lib/ai.action";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router"

const VisualizerId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {initialImage, initialRender, name} = location.state || {};
  const hasInitiallyGenerated = useRef(false);

  //states
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(initialRender);

  const handleBack = () => navigate('/');

  const runGeneration = async() =>{
    if(!initialImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({sourceImage: initialImage});
      if(result.renderedImage){
        setCurrentImage(result.renderedImage);
      }
    } catch (error) {
      console.log('Failed to generate', error);
    }finally{
      setIsProcessing(false);
    }
  } 

  useEffect(() => {
    if(!initialImage || hasInitiallyGenerated.current) return;
    if(initialRender){
      setCurrentImage(initialRender);
      hasInitiallyGenerated
    }
  }, [initialImage, initialRender]);

  return (
    <section>
      <h1>{name || 'Untitled Project'}</h1>
      <div className="viusalizer">
        {initialImage && (
          <div className="image-container">
              <h2>Source Image</h2>
              <img src={initialImage} alt="source" />
          </div>
        )}
      </div>
    </section>
  )
}

export default VisualizerId