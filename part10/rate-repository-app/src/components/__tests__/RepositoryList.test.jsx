import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { RepositoryListContainer } from '../RepositoryList';

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      render(<RepositoryListContainer repositories={repositories} />);

      const repositoryItems = screen.getAllByTestId('repositoryItem');
      expect(repositoryItems).toHaveLength(2);

      const [firstItem, secondItem] = repositoryItems;

      // Assert first item (jaredpalmer/formik)
      expect(firstItem).toHaveTextContent('jaredpalmer/formik');
      expect(firstItem).toHaveTextContent('Build forms in React, without the tears');
      expect(firstItem).toHaveTextContent('TypeScript');
      expect(firstItem).toHaveTextContent('21.9k'); // stargazersCount 21856 -> 21.9k
      expect(firstItem).toHaveTextContent('1.6k');  // forksCount 1619 -> 1.6k
      expect(firstItem).toHaveTextContent('3');     // reviewCount 3
      expect(firstItem).toHaveTextContent('88');    // ratingAverage 88

      // Assert second item (async-library/react-async)
      expect(secondItem).toHaveTextContent('async-library/react-async');
      expect(secondItem).toHaveTextContent('Flexible promise-based React data loader');
      expect(secondItem).toHaveTextContent('JavaScript');
      expect(secondItem).toHaveTextContent('1.8k'); // stargazersCount 1760 -> 1.8k
      expect(secondItem).toHaveTextContent('69');   // forksCount 69 -> 69
      expect(secondItem).toHaveTextContent('3');    // reviewCount 3
      expect(secondItem).toHaveTextContent('72');   // ratingAverage 72
    });
  });
});
