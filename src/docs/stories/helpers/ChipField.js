import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { withStyles, FormControl, InputLabel, FormHelperText, Input, Chip } from '@material-ui/core'
import Flexbox from 'flexbox-react'

class ChipField extends React.PureComponent {
  render() {
    const {
      label,
      value,
      fullWidth,
      error,
      helperText,
      placeholder,
    } = this.props
    const { focused, inputValue } = this.state
    const shouldShrink = value.size > 0 || focused

    return (
      <FormControl fullWidth={fullWidth} error={error}>
        {label &&
          <InputLabel shrink={shouldShrink}>{label}</InputLabel>
        }
        {this.renderChips()}
        <Input
          inputRef={node => this.inputElement = node}
          value={inputValue}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleInputChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={placeholder}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    )
  }

  state = {
    inputValue: '',
    focused: false,
    editIndex: -1,
  }

  inputElement = null

  renderChips = () => {
    const { classes, value } = this.props
    const { editIndex } = this.state

    return (
      <Flexbox flexWrap='wrap' className={classes.chips}>
        {value
          .filter((v, index) => index !== editIndex)
          .map((v, index) => (
            <Chip
              key={`${v}${String(index)}`}
              label={v}
              className={classes.chip}
              onClick={() => this.editChip(v, index)}
              onDelete={() => this.onDelete(index)}
            />
          ))}
      </Flexbox>
    )
  }

  editChip = (inputValue, editIndex) => {
    this.setState({
      inputValue,
      editIndex,
    })
    if (editIndex >= 0 && this.inputElement) {
      this.inputElement.focus()
    }
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = ({ target }) => {
    const { onBlur, value } = this.props
    this.setState({ focused: false })
    let blurValue
    if (target.value) {
      blurValue = this.acceptInput(target.value)
    } else {
      blurValue = value
    }

    if (onBlur) {
      onBlur(blurValue)
    }
  }

  handleKeyDown = (e) => {
    const { keyCode, target } = e
    switch (keyCode) {
      case 13:
        e.preventDefault()
        this.acceptInput(target.value)
        break
    }
  }

  handleInputChange = ({ target }) => {
    this.setState({
      inputValue: target.value,
    })
  }

  acceptInput = inputValue => {
    const { value, onChange } = this.props
    const { editIndex } = this.state
    let update
    if (editIndex !== -1) {
      update = value.set(editIndex, inputValue)
      onChange(update)
    } else {
      update = value.push(inputValue)
      onChange(update)
    }
    this.editChip('', -1)
    return update
  }

  onDelete = index => {
    const { onChange, value } = this.props
    onChange(value.delete(index))
  }
}

ChipField.propTypes = {
  fullWidth: PropTypes.bool,
  error: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
}

ChipField.defaultProps = {
  value: List(),
  label: undefined,
  helperText: undefined,
  fullWidth: false,
  error: false,
  onBlur: undefined,
  placeholder: undefined,
}

const styles = ({ spacing }) => ({
  chips: {
    marginTop: spacing.unit * 2.5,

  },
  chip: {
    marginRight: spacing.unit / 2,
    marginBottom: spacing.unit / 2,
  },
})

export default withStyles(styles)(ChipField)
