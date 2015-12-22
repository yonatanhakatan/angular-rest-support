function jsonApiDataBuilder() {
  return {
    allAuthors: JSON.stringify({
      'data': [
        {
          'id': '1',
          'type': 'authors',
          'attributes': {
            'name': 'J. R. R. Tolkien',
            'date_of_birth': '1892-01-03',
            'date_of_death': '1973-09-02',
            'created_at': '2015-12-21 10:04:43',
            'updated_at': '2015-12-21 10:04:43'
          },
          'relationships': {
            'books': {
              'links': {
                'self': '/v1/authors/1/relationships/books',
                'related': '/v1/authors/1/books'
              }
            },
            'photos': {
              'links': {
                'self': '/v1/authors/1/relationships/photos',
                'related': '/v1/authors/1/photos'
              }
            }
          },
          'links': {
            'self': '/v1/authors/1'
          }
        },
        {
          'id': '2',
          'type': 'authors',
          'attributes': {
            'name': 'J. K. Rowling',
            'date_of_birth': '1965-07-31',
            'date_of_death': null,
            'created_at': '2015-12-21 10:04:43',
            'updated_at': '2015-12-21 10:04:43'
          },
          'relationships': {
            'books': {
              'links': {
                'self': '/v1/authors/2/relationships/books',
                'related': '/v1/authors/2/books'
              }
            },
            'photos': {
              'links': {
                'self': '/v1/authors/2/relationships/photos',
                'related': '/v1/authors/2/photos'
              }
            }
          },
          'links': {
            'self': '/v1/authors/2'
          }
        }
      ]
    }),
    authorsRequestTransformer: {
      transform: function(data) {
        return {
          'data': {
            'type': 'authors',
            'attributes': {
              'name': data.name,
              'date_of_birth': data.dob
            }
          }
        };
      }
    },
    authorsResponseTransformer: {
      transform: function(rawData) {
        var transformedCollection = [];
        for (var i = 0; i < rawData.data.length; i++) {
          var dataItem = rawData.data[i];
          transformedCollection.push({
            id: dataItem.id,
            createdAt: dataItem.attributes.created_at,
            dob: dataItem.attributes.date_of_birth,
            dod: dataItem.attributes.date_of_death,
            name: dataItem.attributes.name,
            updatedAt: dataItem.attributes.updated_at
          });
        }
        return transformedCollection;
      }
    }
  };
}
