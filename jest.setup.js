import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;