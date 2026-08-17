import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  error: {
    borderColor: '#d73a4a',
  },
});

const TextInput = ({ style, error, ...props }) => {
  const inputStyle = [styles.input, error && styles.error, style];

  return <NativeTextInput style={inputStyle} {...props} />;
};

export default TextInput;
