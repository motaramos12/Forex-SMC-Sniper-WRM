
import type { CorrelationMatrixData } from '../types';

// Helper to generate a random correlation value between -1 and 1
const generateRandomCorrelation = (): number => {
    return Math.random() * 2 - 1;
};

export const getCorrelationMatrix = (pairs: string[]): Promise<CorrelationMatrixData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const matrix: CorrelationMatrixData = {};

            pairs.forEach(pair1 => {
                matrix[pair1] = {};
                pairs.forEach(pair2 => {
                    if (pair1 === pair2) {
                        matrix[pair1][pair2] = 1; // A pair is perfectly correlated with itself
                    } else if (matrix[pair2] && typeof matrix[pair2][pair1] !== 'undefined') {
                        // Use existing value for symmetrical pairs
                        matrix[pair1][pair2] = matrix[pair2][pair1];
                    } else {
                        matrix[pair1][pair2] = generateRandomCorrelation();
                    }
                });
            });

            resolve(matrix);
        }, 300); // Reduzido de 800ms
    });
};
