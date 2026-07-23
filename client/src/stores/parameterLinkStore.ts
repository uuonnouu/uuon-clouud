import { create } from 'zustand';

export interface LinkedShape {
  id: string;
  shapeName: string;
  parameters: Record<string, number>;
}

export interface ParameterLink {
  id: string;
  name: string;
  shapes: LinkedShape[];
  linkedParams: string[];
  masterShapeId: string | null;
}

interface ParameterLinkStore {
  links: ParameterLink[];
  activeLink: string | null;
  
  createLink: (name: string) => string;
  removeLink: (linkId: string) => void;
  setActiveLink: (linkId: string | null) => void;
  
  addShapeToLink: (linkId: string, shapeName: string, initialParams: Record<string, number>) => string;
  removeShapeFromLink: (linkId: string, shapeId: string) => void;
  
  linkParameter: (linkId: string, paramName: string) => void;
  unlinkParameter: (linkId: string, paramName: string) => void;
  
  updateLinkedParameter: (linkId: string, paramName: string, value: number) => void;
  updateShapeParameter: (linkId: string, shapeId: string, paramName: string, value: number) => void;
  
  setMasterShape: (linkId: string, shapeId: string | null) => void;
  
  getLinkById: (linkId: string) => ParameterLink | undefined;
  getShapeParameters: (linkId: string, shapeId: string) => Record<string, number> | undefined;
}

export const useParameterLinkStore = create<ParameterLinkStore>((set, get) => ({
  links: [],
  activeLink: null,
  
  createLink: (name: string) => {
    const id = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLink: ParameterLink = {
      id,
      name,
      shapes: [],
      linkedParams: [],
      masterShapeId: null
    };
    
    set((state) => ({
      links: [...state.links, newLink],
      activeLink: id
    }));
    
    return id;
  },
  
  removeLink: (linkId: string) => {
    set((state) => ({
      links: state.links.filter(link => link.id !== linkId),
      activeLink: state.activeLink === linkId ? null : state.activeLink
    }));
  },
  
  setActiveLink: (linkId: string | null) => {
    set({ activeLink: linkId });
  },
  
  addShapeToLink: (linkId: string, shapeName: string, initialParams: Record<string, number>) => {
    const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId) {
          const newShape: LinkedShape = {
            id: shapeId,
            shapeName,
            parameters: { ...initialParams }
          };
          
          return {
            ...link,
            shapes: [...link.shapes, newShape],
            masterShapeId: link.shapes.length === 0 ? shapeId : link.masterShapeId
          };
        }
        return link;
      })
    }));
    
    return shapeId;
  },
  
  removeShapeFromLink: (linkId: string, shapeId: string) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId) {
          const newShapes = link.shapes.filter(s => s.id !== shapeId);
          return {
            ...link,
            shapes: newShapes,
            masterShapeId: link.masterShapeId === shapeId 
              ? (newShapes.length > 0 ? newShapes[0].id : null)
              : link.masterShapeId
          };
        }
        return link;
      })
    }));
  },
  
  linkParameter: (linkId: string, paramName: string) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId && !link.linkedParams.includes(paramName)) {
          const masterShape = link.shapes.find(s => s.id === link.masterShapeId);
          const masterValue = masterShape?.parameters[paramName] ?? 1.0;
          
          const updatedShapes = link.shapes.map(shape => ({
            ...shape,
            parameters: {
              ...shape.parameters,
              [paramName]: masterValue
            }
          }));
          
          return {
            ...link,
            linkedParams: [...link.linkedParams, paramName],
            shapes: updatedShapes
          };
        }
        return link;
      })
    }));
  },
  
  unlinkParameter: (linkId: string, paramName: string) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId) {
          return {
            ...link,
            linkedParams: link.linkedParams.filter(p => p !== paramName)
          };
        }
        return link;
      })
    }));
  },
  
  updateLinkedParameter: (linkId: string, paramName: string, value: number) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId && link.linkedParams.includes(paramName)) {
          return {
            ...link,
            shapes: link.shapes.map(shape => ({
              ...shape,
              parameters: {
                ...shape.parameters,
                [paramName]: value
              }
            }))
          };
        }
        return link;
      })
    }));
  },
  
  updateShapeParameter: (linkId: string, shapeId: string, paramName: string, value: number) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId) {
          return {
            ...link,
            shapes: link.shapes.map(shape => {
              if (shape.id === shapeId) {
                return {
                  ...shape,
                  parameters: {
                    ...shape.parameters,
                    [paramName]: value
                  }
                };
              }
              return shape;
            })
          };
        }
        return link;
      })
    }));
  },
  
  setMasterShape: (linkId: string, shapeId: string | null) => {
    set((state) => ({
      links: state.links.map(link => {
        if (link.id === linkId) {
          return {
            ...link,
            masterShapeId: shapeId
          };
        }
        return link;
      })
    }));
  },
  
  getLinkById: (linkId: string) => {
    return get().links.find(link => link.id === linkId);
  },
  
  getShapeParameters: (linkId: string, shapeId: string) => {
    const link = get().links.find(l => l.id === linkId);
    const shape = link?.shapes.find(s => s.id === shapeId);
    return shape?.parameters;
  }
}));
