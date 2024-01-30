type SpacerProps = {
  mt?: string,
  mr?: string,
  mb?: string,
  ml?: string
}

const Spacer = ({ mt, mr, mb, ml }: SpacerProps) => (
  <div style={{ marginTop: mt, marginRight: mr, marginBottom: mb, marginLeft: ml }} />
)

export default Spacer