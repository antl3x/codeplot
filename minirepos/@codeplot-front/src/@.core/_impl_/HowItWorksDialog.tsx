import { Link } from "@.ui.Link";
import { Content, Dialog, DialogContainer } from "@adobe/react-spectrum";
import { useState } from "react";

export function HowItWorksDialog() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Link onClick={() => setOpen(true)} href="#">
        How it Works
      </Link>
      <DialogContainer isDismissable={true} onDismiss={() => setOpen(false)}>
        {isOpen && (
          <Dialog>
            <Content>
              <div
                style={{
                  overflow: "hidden",
                  paddingBottom: "56.25%",
                  position: "relative",
                  height: "0",
                  borderRadius: "8px",
                }}
              >
                <iframe
                  width="560"
                  height="315"
                  style={{
                    left: "0",
                    top: "0",
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                  }}
                  src="https://www.youtube.com/embed/x7QLEu5t17g"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              </div>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </>
  );
}
