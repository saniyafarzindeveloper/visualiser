import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Button from "components/ui/Button";
import Upload from "components/Upload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



export default function Home() {
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
            <Upload onComplete={(base64Data) => {
              console.log("upload done",base64Data);
            }} />
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
            <div className="project-card group ">
              <div className="preview">
                <img src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png" />
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="card-body">
                <div>
                  <h3>Project Kurla</h3>
                  <div className="meta">
                    <Clock size={12} />
                    <span>{new Date("01.01.2027").toLocaleDateString()}</span>
                    <span>By Adani</span>
                  </div>
                </div>

                <div className="arrow">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
