import fs from 'fs';
import path from 'path';

const createOverlayPath = path.join(
  __dirname,
  '../../react/src/components/stencil-generated/react-component-lib/createOverlayComponent.tsx'
);
const utilsPath = path.join(
  __dirname,
  '../../react/src/components/stencil-generated/react-component-lib/utils/index.tsx'
);

try {
  // Patch createOverlayComponent.tsx
  let content = fs.readFileSync(createOverlayPath, 'utf8');
  if (
    !content.includes('// @ts-ignore - Stencil generated component compatibility with React 18')
  ) {
    content = content.replace(
      '  return React.forwardRef<OverlayType, Props>((props, ref) => {',
      '  return React.forwardRef<OverlayType, Props>((props, ref) => {\n    // @ts-ignore - Stencil generated component compatibility with React 18'
    );
    fs.writeFileSync(createOverlayPath, content);
    console.log('Patched createOverlayComponent.tsx');
  }

  // Patch utils/index.tsx
  content = fs.readFileSync(utilsPath, 'utf8');
  if (
    !content.includes('// @ts-ignore - Stencil generated component compatibility with React 18')
  ) {
    content = content.replace(
      '  forwardRef.displayName = displayName;\n\n  return React.forwardRef(forwardRef);',
      '  forwardRef.displayName = displayName;\n\n  // @ts-ignore - Stencil generated component compatibility with React 18\n  return React.forwardRef(forwardRef);'
    );
    fs.writeFileSync(utilsPath, content);
    console.log('Patched utils/index.tsx');
  }
} catch (e) {
  console.log('Patch failed:', e.message);
}
