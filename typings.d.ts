/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const svgComponent: SvgrComponent;
  export { svgComponent as ReactComponent };
}
