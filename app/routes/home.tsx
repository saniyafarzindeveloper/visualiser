import Navbar from "components/Navbar";
import type { Route } from "./+types/home"; 
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Button from "components/ui/Button";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { createProject } from "lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "3D Visualizer" },
    { name: "description", content: "Welcome!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  //fetching created projects to display them on the homepage
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);

  const handleUpload = async (base64Image: string) => {
    if(isCreatingProjectRef.current) return false;
    isCreatingProjectRef.current = true;

    try {
      const newId = Date.now().toString();
    //creating the name project by naming it
    const name = `Residence ${newId}`;
    const newItem = {
      id: newId,
      name,
      sourceImage: base64Image,
      renderedImage: undefined,
      timestamp: Date.now(),
    };
    const saved = await createProject({ item: newItem, visibility: "private" });
    if (!saved) {
      console.error("Failed to create project");
      return false;
    }

    //if projects are created successfully
    setProjects((prev) => [saved, ...prev]); //pre-pending the newly created item
    navigate(`/visualizer/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        initialREnder: saved.renderedImage || null,
        name,
      },
    });
    return true;
    } finally  {
      isCreatingProjectRef.current = false;
    }

    
  };
  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Visualizer</p>
        </div>
        <h1>Visualize your 2D plans to 3D in a matter of minutes</h1>
        <p className="subtitle">
          We help you visualize, render & ship architecture - powered by AI
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />
          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>
              <h3>Upload your floor plan</h3>
              <p>**Supports only JPG, PNG formats upto 10MB</p>
            </div>
            <Upload onComplete={handleUpload} />
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work & shared projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(
              ({ id, name, renderedImage, sourceImage, timestamp }) => (
                <div
                  key={id}
                  className="project-card group"
                  onClick={() => navigate(`/visualizer/${id}`)}
                >
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt="Project" />

                    <div className="badge">
                      <span>Community</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>

                      <div className="meta">
                        <Clock size={12} />
                        <span>{new Date(timestamp).toLocaleDateString()}</span>
                        <span>By JS Mastery</span>
                      </div>
                    </div>
                    <div className="arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
