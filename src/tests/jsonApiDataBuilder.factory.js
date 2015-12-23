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
    allAuthorsValidationErrors: JSON.stringify({
      'errors': [
        {
          'title': 'Error 1',
          'detail': 'There was a problem with the name'
        },
        {
          'title': 'Error 2',
          'detail': 'There was a problem with the email'
        }
      ]
    }),
    allBooks: JSON.stringify({
      'data': [
        {
          'id': '1',
          'type': 'books',
          'attributes': {
            'date_published': '1954-07-29',
            'title': 'The Fellowship of the Ring',
            'created_at': '2015-12-23 10:36:19',
            'updated_at': '2015-12-23 10:36:19'
          },
          'relationships': {
            'chapters': {
              'links': {
                'self': '/v1/books/1/relationships/chapters',
                'related': '/v1/books/1/chapters'
              }
            },
            'firstChapter': {
              'links': {
                'self': '/v1/books/1/relationships/firstChapter',
                'related': '/v1/books/1/firstChapter'
              }
            },
            'series': {
              'links': {
                'self': '/v1/books/1/relationships/series',
                'related': '/v1/books/1/series'
              },
              'data': {
                'id': '1',
                'type': 'series'
              }
            },
            'author': {
              'links': {
                'self': '/v1/books/1/relationships/author',
                'related': '/v1/books/1/author'
              },
              'data': {
                'id': '1',
                'type': 'authors'
              }
            },
            'stores': {
              'links': {
                'self': '/v1/books/1/relationships/stores',
                'related': '/v1/books/1/stores'
              }
            },
            'photos': {
              'links': {
                'self': '/v1/books/1/relationships/photos',
                'related': '/v1/books/1/photos'
              }
            }
          },
          'links': {
            'self': '/v1/books/1'
          }
        },
        {
          'id': '2',
          'type': 'books',
          'attributes': {
            'date_published': '1954-11-11',
            'title': 'The Two Towers',
            'created_at': '2015-12-23 10:36:19',
            'updated_at': '2015-12-23 10:36:19'
          },
          'relationships': {
            'chapters': {
              'links': {
                'self': '/v1/books/2/relationships/chapters',
                'related': '/v1/books/2/chapters'
              }
            },
            'firstChapter': {
              'links': {
                'self': '/v1/books/2/relationships/firstChapter',
                'related': '/v1/books/2/firstChapter'
              }
            },
            'series': {
              'links': {
                'self': '/v1/books/2/relationships/series',
                'related': '/v1/books/2/series'
              },
              'data': {
                'id': '1',
                'type': 'series'
              }
            },
            'author': {
              'links': {
                'self': '/v1/books/2/relationships/author',
                'related': '/v1/books/2/author'
              },
              'data': {
                'id': '1',
                'type': 'authors'
              }
            },
            'stores': {
              'links': {
                'self': '/v1/books/2/relationships/stores',
                'related': '/v1/books/2/stores'
              }
            },
            'photos': {
              'links': {
                'self': '/v1/books/2/relationships/photos',
                'related': '/v1/books/2/photos'
              }
            }
          },
          'links': {
            'self': '/v1/books/2'
          }
        }
      ]
    }),
    authorsDefaultErrorTransformer: {
      transform: function(rawData) {
        var transformedCollection = [];
        for (var i = 0; i < rawData.errors.length; i++) {
          transformedCollection.push(rawData.errors[i].detail);
        }
        return {errors: transformedCollection};
      }
    },
    authorsDefaultRequestTransformer: {
      transform: function(data) {
        return {
          'name': data.name,
          'date_of_birth': data.dob
        };
      }
    },
    authorsDefaultResponseTransformer: {
      transform: function(rawData) {
        var transformedCollection = [];
        for (var i = 0; i < rawData.data.length; i++) {
          var dataItem = rawData.data[i];
          transformedCollection.push({
            _id: dataItem.id,
            _createdAt: dataItem.attributes.created_at,
            _dob: dataItem.attributes.date_of_birth,
            _dod: dataItem.attributes.date_of_death,
            _name: dataItem.attributes.name,
            _updatedAt: dataItem.attributes.updated_at
          });
        }
        return transformedCollection;
      }
    },
    authorsErrorTransformer: {
      transform: function(rawData) {
        var transformedCollection = [];
        for (var i = 0; i < rawData.errors.length; i++) {
          transformedCollection.push(rawData.errors[i].detail);
        }
        return transformedCollection;
      }
    },
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
