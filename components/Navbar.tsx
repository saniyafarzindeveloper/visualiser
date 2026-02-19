import { Box } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";


const Navbar = () => {
    // const isSignedIn = false;
    // const username = 'saniya';
    const {isSignedIn, userName, signIn, signOut} = useOutletContext<AuthContext>()
    const handleAuth = async() => {
      if(isSignedIn){
        try {
          await signOut();
        } catch (error) {
          console.log("puter sign out failed", error);
        }
      }

      //if not signed in
      try {
        await signIn();
      } catch (error) {
        console.log('error in puter signin in', error);
      }
    }
  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Visualizer</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>
        <div className="actions">
            {isSignedIn ? (
                <>
                <span className="greeting">
                    {userName ? `Hello, ${userName}` : 'Signed In'}
                </span>
                <Button onClick={handleAuth} size="sm" className="btn">
                    Log Out
                </Button>
                </>
            ): (
                <>
                 <Button onClick={handleAuth} size="sm" variant="ghost">
                Log In
            </Button>
            <a href="#upload" className="cta">
        Get Started
            </a>
                </>
            )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
