const blockSize = 1.5;
const mapstr = `
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
a                                   a                                 a
a                                   a                                 a
a                                   a                                 a
a                                                                     a
a                                                                c    a
a                                   a                                 a
a                                   a                                 a
a                                  aa                                 a
a                                  aaaaaaaaaaa  a   a   a             a
a                                  a         a  a   a   a             a
a                                  a         a  a   a   a             a
a             aaaaaaaaaaa          a         a  a   a   a             a
a             a         a          a         a  a   a   a             a
a             a         a          a         a  a   a   a             a
a             a         a          a         a  a   a   aa            a
a             a  aaaaa  a          a         a  a   a    a            a
a       c     a     aa  a          a         a  a   aa   aa           a
a             a     ca  a          a         a  a   aa    a           a
a             a     aa  a          a         a  a    a    aa          a
a             aaaaaaaa  a          a            a    aa    a          a
a                       a          a            a     a    a          a
a                       a          a            a  c  aa   aa         a
a    aaaaaaaaaaaaaaaaaaaa          a            a      a    a         a
a    a                                          a      aa   a         a
a    a                                          aaa    aa c a         a
a    a                                           aaa    a   aa        a
a    aaaaaaaaaa                                   aaa   a    a        a
a                                                  aaa  aa   a        a
a                                                    a   a   a        a
a                            aaaaaaaaaaaaaaaaa       a   a   a        a
a              a             a               a           a   a        a
aaaaaaaaaa     a             a               a         c a   a        a
a              a             a               a           a   a        a
a b            a             a   a       a   aaa  aaaaaaaa   a        a
a              a  aaaaaaaaa  a   a       a   a               a        a
a              a             a   a       a   a               aaaa     a
a              a             a   a   h   a   a                        a
a              a             a   a       a   a                        a
a              a             a   a       a   a                        a
a              a             a   aaaaaaaaa   a                        a
a              a             a      aaa      a                        a
a                      a            aaa            a                  a
a                      a            aaa            a                  a
a                      a            aaa            a                  a
a                      a            aaa            aaaaaaaaaaa        a
a           m          a            aaa            a                  a
a               c      a            aaa            a                  a
a                      aaaaaaaaaaaaaaaaaaaaaaaaaaaaa                  a
a     aaaaaaa               a                                         a
a          ca               a                                a a a    a
a           a               a                                         a
a           a               a                                a c a    a
a           a               a                                         a
aaaaaaa     a               a                                a a a    a
a  c  a     a       aaaa  aaa       a                                 a
a     a     a       a               a                                 a
a     a     a       a               a                                 a
a     a     a       a               a      aaaaaaaaaaaaaaaa           a
a     a     a       a               a      a              aaaaaaaaaaaaa
a     a     a                       a      a                           
a     a     a                       a      a                           
a     a     a                       a      a                           
a     a                             a      a                           
a     a                             a      a                           
a     a                                    a                           
a     a                                    a                           
a     aaaaaaaaaaaaaaaaaaaaa                a                           
a                                          a                           
a                                          a                           
a                                          a                           
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa                           `